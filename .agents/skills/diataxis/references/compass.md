# The Diátaxis Compass

The Diátaxis compass is a decision tool for classifying documentation. While the Diátaxis map shows the four quadrants and their relationships, the compass tells you how to navigate to the correct one.

## The Two Axes

Diátaxis is built on two fundamental dimensions of craft:

### Axis 1: Action vs Cognition

- **Action**: Practical knowledge—knowing *how*, what we do
- **Cognition**: Theoretical knowledge—knowing *that*, what we think

### Axis 2: Acquisition vs Application

- **Acquisition**: Learning, study—gaining skill and knowledge
- **Application**: Work—using skill and knowledge to get things done

These two axes create four quadrants:

```
                    ACQUISITION                     APPLICATION
                    (study)                         (work)
                         │                               │
         ┌───────────────┼───────────────┬───────────────┼───────────────┐
         │               │               │               │               │
ACTION   │           TUTORIAL            │           HOW-TO              │
(doing)  │     learning-oriented         │       goal-oriented           │
         │               │               │               │               │
         ├───────────────┼───────────────┼───────────────┼───────────────┤
         │               │               │               │               │
COGNTIC  │         EXPLANATION           │          REFERENCE            │
(knowing)│   understanding-oriented      │     information-oriented      │
         │               │               │               │               │
         └───────────────┴───────────────┴───────────────┴───────────────┘
```

## The Compass Decision Tree

Use these two questions to classify any content:

### Question 1: Action or Cognition?

> Does this content inform what the reader **does** or what the reader **knows**?

- If it guides **action** (steps, procedures, activities) → Tutorial or How-to
- If it informs **cognition** (facts, concepts, understanding) → Reference or Explanation

### Question 2: Acquisition or Application?

> Does this content serve the reader's **study** or their **work**?

- If it serves **acquisition** (learning, study) → Tutorial or Explanation
- If it serves **application** (work, doing the job) → How-to or Reference

### The Compass Table

| Content informs... | And serves... | Therefore it's... |
|--------------------|---------------|-------------------|
| Action | Acquisition (study) | **Tutorial** |
| Action | Application (work) | **How-to Guide** |
| Cognition | Application (work) | **Reference** |
| Cognition | Acquisition (study) | **Explanation** |

## Applying the Compass

The compass is applied by examining the content against two criteria:

### Content Type Signals

The following signals indicate orientation:

| Signal | Indicates |
|--------|-----------|
| Steps to follow | Action-oriented |
| Descriptions of how things are | Cognition-oriented |
| Learning context assumed | Acquisition-oriented |
| Working context assumed | Application-oriented |

### Axis Determination

**Action vs Cognition signals:**
- Procedures, commands, things to do → Action
- Descriptions, facts, concepts → Cognition

**Acquisition vs Application signals:**
- Reader is learning/studying → Acquisition
- Reader is working/doing their job → Application

### Cross-Reference

The compass table maps the intersection of these axes to the quadrant. Conflicting signals indicate mixed-mode content that may require restructuring.

## Alternative Question Framings

The compass questions can be asked in different ways:

### For Action vs Cognition

- "Is this about what to *do* or what to *know*?"
- "Am I writing about *activities* or *information*?"
- "Will the reader *perform* something or *understand* something?"
- "Does this contain *instructions* or *descriptions*?"

### For Acquisition vs Application

- "Is the reader at *study* or at *work*?"
- "Is this for *learning* or *doing the job*?"
- "Is the reader *gaining* skills or *using* skills?"
- "Would this be read *before* or *during* work?"

## Compass Examples

### Example 1: API Endpoint Documentation

> **Content**: "The `/users` endpoint accepts GET and POST requests. GET returns a list of users; POST creates a new user. Required fields: name (string), email (string)."

**Analysis**:
- Action or Cognition? → **Cognition** (describes what the endpoint does)
- Acquisition or Application? → **Application** (used while building)

**Classification**: **Reference** (high confidence)
**Evidence**: Factual descriptions, no procedures, structured for lookup during work.

### Example 2: Getting Started Guide

> **Content**: "In this guide, we'll build a simple web application. First, create a new project directory. Then initialize npm..."

**Analysis**:
- Action or Cognition? → **Action** (steps to follow)
- Acquisition or Application? → **Acquisition** (learning the system)

**Classification**: **Tutorial** (high confidence)
**Evidence**: Sequential steps, first-person plural ("we'll"), learning framing, instructor-guided.

### Example 3: Configuring SSL Certificates

> **Content**: "To enable SSL for your domain: 1. Generate a certificate signing request. 2. Submit to certificate authority. 3. Install the certificate..."

**Analysis**:
- Action or Cognition? → **Action** (procedures to follow)
- Acquisition or Application? → **Application** (doing a work task)

**Classification**: **How-to** (high confidence)
**Evidence**: Goal-oriented heading, numbered steps, assumes competence, addresses real task.

### Example 4: Why We Use Microservices

> **Content**: "Microservices emerged as a response to the limitations of monolithic architecture. When a system grows, a monolith becomes increasingly difficult to modify..."

**Analysis**:
- Action or Cognition? → **Cognition** (concepts and reasoning)
- Acquisition or Application? → **Acquisition** (understanding, not working)

**Classification**: **Explanation** (high confidence)
**Evidence**: Discursive prose, historical context, reasoning ("why"), no procedures.

## Handling Ambiguity

### Conflicting Signals

Conflicting signals typically indicate one of three conditions:

- **Incomplete analysis**: Initial reading missed relevant signals
- **Mixed content**: Document serves multiple purposes
- **Context dependency**: Classification depends on where/by whom it is read

### Confidence Levels

| Confidence | Criteria |
|------------|----------|
| High | Clear signals on both axes |
| Medium | Clear on one axis, uncertain on the other |
| Low | Signals conflict or are weak |

Classification reports include evidence supporting the determination.

### Mixed Content

Content spanning multiple quadrants is identified by:

- Sections belonging to different quadrants
- Multiple valid classifications for different portions
- Need for restructuring into separate documents

Mixed content is flagged rather than forced into a single classification.

## Edge Cases

### "Getting Started" Documents

Often mixed: tutorial-style introduction with reference elements.

**Resolution**: Split into a true tutorial (learning journey) and reference (quick facts).

### Troubleshooting Guides

Usually how-to guides addressing problems.

**Test**: If it's "How to fix X" → How-to. If it's "Understanding why X happens" → Explanation.

### FAQ Documents

Often mixed: some answers are reference, some are explanation, some are how-to.

**Resolution**: Consider splitting by type, or accept as an index that links to proper quadrant docs.

### README Files

Typically mixed: introduction (explanation), quick start (tutorial), installation (how-to), API (reference).

**Resolution**: Keep brief overview in README; link to proper quadrant documents for details.

## Compass Classification Process

The classification process follows this sequence:

| Phase | Activity |
|-------|----------|
| Input | Content (or request for content) is examined |
| Axis 1 | Action or Cognition determination |
| Axis 2 | Acquisition or Application determination |
| Resolution | Cross-reference yields quadrant |
| Validation | Check for conflicting signals |
| Output | Classification with confidence and evidence |
| Exception | Mixed content triggers restructuring recommendation |
