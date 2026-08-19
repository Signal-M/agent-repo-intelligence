# Economics and TCO

Use this reference when the decision goal involves adoption, build versus buy, procurement, investment, or a measurable pilot. Never invent business inputs.

## Contents

1. Input discipline
2. Value model
3. Cost model
4. Risk adjustment
5. Scenarios and sensitivity
6. Decision output

## 1. Input discipline

Classify every input as:

- `observed`: measured baseline or invoice;
- `provided`: supplied by the user or business owner;
- `estimated`: explicit range with rationale;
- `unknown`: required but unavailable.

Do not produce a single ROI number when material inputs are unknown. Produce a required-input list or a threshold calculation instead.

Recommended inputs:

- task volume per period;
- current handling time and loaded labor cost;
- current completion, defect, escalation, and rework rates;
- expected adoption and eligible-task share;
- Agent success, intervention, and severe-error rates;
- model, search, tool, storage, and infrastructure cost per task;
- implementation, integration, security, evaluation, training, and migration cost;
- recurring maintenance and incident-response cost;
- horizon, currency, and discount assumptions where relevant.

## 2. Value model

Use the simplest defensible unit model:

```text
grossLaborValue
= taskVolume × eligibleShare × adoptionRate
× minutesSavedPerTask / 60 × loadedLaborCostPerHour

qualityValue
= avoidedDefects × costPerDefect
+ avoidedEscalations × costPerEscalation
+ incrementalOutcomeValue

realizedValue
= (grossLaborValue + qualityValue) × realizationFactor
```

Do not count time saved as realized value when the organization cannot redeploy the capacity. State whether value is cash saving, capacity creation, speed, quality, risk reduction, or strategic option value.

## 3. Cost model

Include more than model tokens:

```text
variableCost
= taskVolume × adoptionRate
× (model + retrieval + tool + storage + network cost per task)

humanControlCost
= reviewedTasks × reviewMinutes / 60 × reviewerCostPerHour

annualizedFixedCost
= implementation amortization
+ integration and migration
+ evaluation and red-team operation
+ security and compliance
+ training and change management
+ maintenance and upgrade work
+ support and incident response

totalCost = variableCost + humanControlCost + annualizedFixedCost
```

For open source, include:

- upstream upgrade and compatibility work;
- fork maintenance and merge burden;
- vulnerability monitoring and patch response;
- internal expertise and on-call requirements;
- license review and redistribution obligations;
- exit or replacement cost.

## 4. Risk adjustment

Model only material, estimable failure exposure:

```text
expectedLoss
= severeFailureProbability × exposedTasks × averageImpact
+ moderateFailureProbability × exposedTasks × averageReworkCost
```

Do not use expected value to justify catastrophic or non-compliant risk. Treat hard policy, safety, legal, or reputational constraints as gates rather than costs that can be averaged away.

```text
netValue = realizedValue - totalCost - expectedLoss
benefitCostRatio = realizedValue / (totalCost + expectedLoss)
```

Calculate payback only when implementation cost and recurring monthly net value are credible.

## 5. Scenarios and sensitivity

Produce at least `downside`, `base`, and `upside` scenarios when enough inputs exist. Vary the assumptions that drive the decision:

- adoption rate;
- eligible-task share;
- minutes saved;
- Agent success and intervention rate;
- review time;
- model/tool cost;
- severe failure exposure;
- maintenance burden.

Avoid changing every input at once without explanation. Name the two or three variables with the highest decision sensitivity.

When data is missing, compute thresholds such as:

- minimum adoption rate for positive net value;
- maximum review time before savings disappear;
- maximum cost per successful task;
- required success rate at a fixed failure budget;
- maximum severe-error rate allowed by policy.

## 6. Decision output

Report:

1. unit of value and baseline;
2. input source and confidence;
3. downside/base/upside results;
4. dominant cost drivers;
5. dominant value drivers;
6. risk exposure and non-economic hard gates;
7. break-even thresholds;
8. instrumentation required during the pilot;
9. whether the economic case is `supported`, `conditional`, `unsupported`, or `unknown`.

Never treat repository popularity, benchmark claims, or model context size as an economic outcome.
