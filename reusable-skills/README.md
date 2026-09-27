# Reusable Skills Library

## What Is This?

A portable collection of reusable engineering skills extracted from the **Shivaay Enterprise** project — a production B2B wholesale distribution platform built with React 19, Vite 8, Supabase, and Tailwind CSS v4.

Each skill captures a **coherent engineering capability** — an architecture pattern, a security practice, a database workflow, or a development technique — that can be applied to completely different projects.

## How Was It Created?

These skills were extracted by systematically analysing the completed Shivaay Enterprise repository:

1. **Every source file, migration, configuration, and commit** was examined.
2. **Reusable patterns** were identified — the engineering knowledge that transcends any single project.
3. **Project-specific details** (brand names, exact table schemas, UI styling) were separated from the transferable engineering lessons.
4. Each skill was written to be **self-contained and portable** — understandable without access to the Shivaay source code.

## How Should Another Project Use It?

### Copy only what you need

Each skill lives in its own directory:

```
reusable-skills/
└── security/
    └── row-level-security-design/
        └── SKILL.md
```

To use a skill in another project, copy its directory into your project and reference the `SKILL.md` as a guide. There are no cross-skill dependencies that prevent individual use (though Related Skills sections suggest useful companions).

### Use the INDEX

The [`INDEX.md`](./INDEX.md) contains a master table of all skills and a **Suggested Skill Selection** section that maps common project scenarios to relevant skills.

### For AI agents

These skills follow the standard `SKILL.md` format. An AI coding assistant can read the `SKILL.md` file and apply the patterns when working on your project.

## Important Warning

> **Shivaay-specific examples are included only as reference.** They illustrate how a pattern was applied in one real project. They should **not** automatically be treated as architecture requirements for another project.
>
> Every project has unique constraints. Use the **Core Principles** and **General Pattern** sections as your guide, and adapt the **Shivaay Example** sections to fit your specific context.

## Maintenance

### Adding new skills

When you discover a reusable engineering lesson in a future project:

1. Determine the correct category (`frontend/`, `security/`, `database/`, `engineering/`, or a new one).
2. Create a new directory: `reusable-skills/<category>/<skill-name>/SKILL.md`.
3. Follow the standard SKILL.md structure used by existing skills.
4. Update `INDEX.md` with the new skill.
5. Ensure the skill passes the portability checklist:
   - Could it be used in a completely different project?
   - Is it understandable without the original source code?
   - Does it provide actionable guidance, not just theory?
   - Are project-specific details confined to an example section?

### Updating existing skills

When you encounter a new variation of an existing pattern:

1. Add the new insight to the relevant SKILL.md.
2. If the variation is significant enough, consider splitting into a separate skill.
3. Keep the Shivaay Example section as historical evidence — don't overwrite it. Add new examples in a separate section.

## Skill Categories

| Category | Purpose |
|----------|---------|
| `frontend/` | React architecture, state management, data fetching patterns |
| `security/` | Authentication, authorisation, access control, RLS |
| `database/` | Schema design, migrations, triggers, production safety |
| `engineering/` | Cross-cutting development practices and pipelines |

## Licence

These skills are documentation and engineering knowledge. They are not runnable code. Use them freely in any project.
