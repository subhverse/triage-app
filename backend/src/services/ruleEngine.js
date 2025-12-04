// Simple deterministic rule engine
const TriageRule = require("../models/triageRule");

/**
 * Input:
 *  - symptomCodes: ['chest_pain','breathing_difficulty']
 *  - answers: { breathing_difficulty: true, temperature_value: 39 }
 *
 * Returns:
 *  { severity, reason, guideKey, matchedRuleId }
 */
async function evaluateTriage({ symptomCodes = [], answers = {} }) {
  // load rules, highest priority first
  const rules = await TriageRule.find().sort({ priority: -1, createdAt: 1 }).lean();

  // helper: check if arrA contains all of arrB
  const containsAll = (arrA = [], arrB = []) => {
    const setA = new Set(arrA);
    return arrB.every(x => setA.has(x));
  };

  for (const rule of rules) {
    // rule must have symptomCodes subset of selected
    if (!containsAll(symptomCodes, rule.symptomCodes)) continue;

    // evaluate followUpConditions (if any)
    let followOk = true;
    if (Array.isArray(rule.followUpConditions) && rule.followUpConditions.length) {
      for (const cond of rule.followUpConditions) {
        const key = cond.questionKey;
        const expected = cond.expectedAnswer;
        const actual = answers ? answers[key] : undefined;

        // If expected is an object with $gt or $lt
        if (expected && typeof expected === "object") {
          if ("$gt" in expected) {
            if (!(typeof actual === "number" && actual > expected.$gt)) {
              followOk = false; break;
            }
          } else if ("$lt" in expected) {
            if (!(typeof actual === "number" && actual < expected.$lt)) {
              followOk = false; break;
            }
          } else {
            // unknown operator — require equality fallback
            if (actual !== expected) { followOk = false; break; }
          }
        } else {
          // primitive expected: boolean/number/string — strict equality
          if (actual !== expected) { followOk = false; break; }
        }
      }
    }

    if (!followOk) continue;

    // rule matched
    return {
      severity: rule.severity,
      reason: rule.description || rule.name,
      guideKey: rule.guideKey || null,
      matchedRuleId: rule._id
    };
  }

  // No rule matched — fallback: non urgent
  return {
    severity: "NON_URGENT",
    reason: "No matching rule",
    guideKey: null,
    matchedRuleId: null
  };
}

module.exports = { evaluateTriage };
