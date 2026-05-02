# Diátaxis Anti-Patterns

This reference documents common documentation violations, how to detect them, and how to fix them. Each anti-pattern includes a positive counterexample showing what compliant content looks like.

## Detection Confidence Calibration

When flagging violations, calibrate confidence as follows:

| Confidence | Criteria |
|------------|----------|
| **high** | Multiple strong signals; pattern is unambiguous |
| **medium** | Clear signals present but context could justify; needs review |
| **low** | Weak signals; could be intentional; flag for human judgment |

---

## Anti-Pattern 1: Tutorial with Too Much Explanation

### Problem

A tutorial that stops to explain concepts, theory, or "why" instead of maintaining focus on the learner's practical experience.

### Detection Signals

- Lengthy paragraphs explaining concepts mid-lesson
- "The reason this works is..." followed by theory
- Digressions into history, architecture, or design decisions
- Reader asked to understand before doing
- Sections titled "Understanding X" or "About X" within a tutorial

### Failure Mode

Explanation within tutorials interrupts the action sequence. Cognitive load increases. Learner attention shifts from doing to understanding. Lesson momentum stalls. Completion rates decrease.

### Positive Counterexample

**Violation:**
```markdown
## Step 3: Create the Database

Before we create the database, it's important to understand how PostgreSQL 
handles tablespaces. A tablespace is a location on disk where PostgreSQL 
stores data files. By default, PostgreSQL creates two tablespaces: pg_default 
and pg_global. The pg_default tablespace is used for...
[500 words of explanation]
...Now, run this command:
```

**Compliant:**
```markdown
## Step 3: Create the Database

Run:
```bash
createdb myapp_development
```

You'll see no output if successful. We're using PostgreSQL's default settings, 
which work well for development. (For tablespace configuration, see the 
Reference guide.)
```

### Compliant Pattern

Compliant tutorials exhibit these characteristics:

- Explanatory content exists in a separate Explanation document
- Context within the tutorial is minimal (one sentence maximum)
- Links to deeper explanation are available for interested readers
- Focus remains on the learner's next action

---

## Anti-Pattern 2: How-to That Teaches

### Problem

A how-to guide that assumes the reader is a beginner and tries to teach them rather than guide their work.

### Detection Signals

- "Let's learn how to..." framing
- Extensive background before the first actionable step
- Explaining what things are before using them
- Hand-holding language ("Don't worry if this seems confusing")
- No assumption of prior competence

### Failure Mode

Teaching content delays access to actionable steps. Competent readers encounter friction. Time-to-solution increases. Reader must skip irrelevant sections to find procedures.

### Positive Counterexample

**Violation:**
```markdown
# How to Deploy to Production

Before we begin, let's understand what deployment means. Deployment is the 
process of making your application available to users. There are many ways 
to deploy: you could use a traditional server, a cloud platform, or containers.

Let's start by learning about environments. An environment is...
```

**Compliant:**
```markdown
# How to Deploy to Production

Prerequisites: Application passing CI, production credentials configured.

## Steps

1. Tag the release:
   ```bash
   git tag -a v1.2.0 -m "Release 1.2.0"
   git push origin v1.2.0
   ```

2. Deploy to production:
   ```bash
   ./scripts/deploy.sh production v1.2.0
   ```

3. Verify the deployment:
   ```bash
   curl https://api.example.com/health
   ```

If deployment fails, see Troubleshooting: Failed Deployments.
```

### Compliant Pattern

Compliant how-to guides exhibit these characteristics:

- No beginner-oriented framing
- Prerequisites stated upfront without explanation
- First actionable step appears early
- Competence is assumed; tutorials are linked for those who need them

---

## Anti-Pattern 3: Reference with Narrative

### Problem

Reference documentation that includes instructional narrative, opinions, or procedural guidance instead of pure description.

### Detection Signals

- First-person voice ("I recommend...", "We suggest...")
- Procedural language ("First, you should...", "Next, configure...")
- Opinion or judgment ("This is the best approach...")
- Storytelling or historical context
- "How to" language in what should be factual description

### Failure Mode

Narrative obscures factual content. Information extraction requires parsing prose. Lookup time increases. Structured data becomes buried in sentences. Scannability degrades.

### Positive Counterexample

**Violation:**
```markdown
# Configuration Options

When setting up logging, you'll first want to think about your log levels. 
I personally recommend starting with INFO level for production because it 
gives you enough detail without overwhelming your storage. You should also 
consider where you want your logs to go...
```

**Compliant:**
```markdown
# Configuration Options

## Logging

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `log_level` | string | `"INFO"` | Minimum level to log. Values: `DEBUG`, `INFO`, `WARN`, `ERROR` |
| `log_output` | string | `"stdout"` | Log destination. Values: `stdout`, `stderr`, `file`, `syslog` |
| `log_file` | string | `null` | Path to log file. Required if `log_output` is `file` |

See How-to: Configure Logging for setup guidance.
```

### Compliant Pattern

Compliant reference documentation exhibits these characteristics:

- No first-person voice
- Information presented in tables, lists, or structured descriptions
- Procedural content exists in separate how-to guides
- Language is neutral and factual throughout

---

## Anti-Pattern 4: Explanation with Procedures

### Problem

Explanation documentation that includes step-by-step procedures or actionable instructions instead of discursive discussion.

### Detection Signals

- Numbered steps or ordered lists of actions
- Imperative commands ("Run this", "Configure that")
- "How to" framing within explanatory content
- Code blocks meant to be executed (not illustrated)
- Focus on doing rather than understanding

### Failure Mode

Procedures interrupt discursive flow. Reader context switches between understanding and doing. Reflection breaks. The document fails to maintain a single cognitive mode.

### Positive Counterexample

**Violation:**
```markdown
# Understanding Authentication

Authentication in our system uses JWT tokens. Here's how to set it up:

1. First, install the auth library:
   ```bash
   npm install @our/auth
   ```

2. Configure the secret key:
   ```javascript
   auth.configure({ secret: process.env.JWT_SECRET });
   ```

3. Add the middleware to your routes...
```

**Compliant:**
```markdown
# Understanding Authentication

Our authentication system uses JSON Web Tokens (JWT), a standard that 
emerged from the need to maintain stateless sessions in distributed systems.

## Why JWT?

Traditional session-based authentication requires server-side storage. 
Each request must look up the session, creating a bottleneck in distributed 
deployments. JWT shifts the burden to the client: the token itself contains 
the claims, cryptographically signed.

This choice trades storage for computation—verification is CPU-bound but 
requires no database lookup. For our read-heavy workloads, this tradeoff 
favors JWT.

## Security Considerations

The cryptographic guarantee depends entirely on secret management. A 
compromised secret invalidates all tokens and requires rotation. See 
How-to: Rotate JWT Secrets for the operational procedure.
```

### Compliant Pattern

Compliant explanation documentation exhibits these characteristics:

- No numbered steps or commands
- Procedures referenced via links to how-to guides
- Focus on "why" and "what" rather than "how"
- Code appears only as illustration, not instruction

---

## Anti-Pattern 5: Mixed-Mode Document

### Problem

A single document that serves multiple quadrants, trying to teach, guide, describe, and explain simultaneously.

### Detection Signals

- Document has sections that belong to different quadrants
- Abrupt shifts in tone (teaching → describing → instructing)
- Heading hierarchy mixes modes ("Tutorial", then "Reference", then "How-to")
- Reader unclear whether to study, work, or consult
- Length that suggests multiple purposes compressed

### Failure Mode

Multiple user needs addressed in single document. Reader must filter for relevant content. No single need is served optimally. Document length increases without proportional value. Navigation becomes unclear.

### Positive Counterexample

**Violation:**
```markdown
# User Authentication

## Introduction (Explanation)
Authentication is the process of verifying identity...

## Getting Started (Tutorial)
Let's build a login form. First, create a new component...

## API Reference (Reference)
### `authenticate(credentials)`
Parameters: username, password...

## Configuring SSO (How-to)
To enable single sign-on, follow these steps...
```

**Compliant:**
Split into four documents:

- `tutorials/authentication-basics.md` - Tutorial
- `how-to/configure-sso.md` - How-to guide  
- `reference/auth-api.md` - Reference
- `explanation/auth-architecture.md` - Explanation

Each document serves one need, in one mode, for one context.

### Compliant Pattern

Compliant documentation sets exhibit these characteristics:

- Each quadrant has its own dedicated document
- Content is organized by user need, not by topic
- Cross-links connect related documents across quadrants
- Each document serves a single, clear purpose

---

## Blur Zones: Adjacent Quadrant Confusion

Some quadrant pairs are frequently confused because they share one axis:

| Blur Zone | Shared Axis | Distinction |
|-----------|-------------|-------------|
| Tutorial ↔ How-to | Action | Study vs Work |
| Reference ↔ Explanation | Cognition | Work vs Study |
| Tutorial ↔ Explanation | Acquisition | Action vs Cognition |
| How-to ↔ Reference | Application | Action vs Cognition |

When classification is unclear, ask:

- "Is the reader at study or at work?"
- "Do they need to do something or know something?"

If still ambiguous, flag with medium confidence and request human judgment.
