# .NET Prep 45

A free 45-day interview preparation site for mid-level (4–5 years) .NET developers.

Every question has:

- a short **interview answer in English** you can speak in 30–60 seconds
- a **Hinglish explanation** ("Samjho") so the concept actually makes sense
- code (C# or IBM DB2 SQL), follow-up questions and an interview tip

Topics: C#, ASP.NET MVC, ASP.NET Core, Web API/REST, SQL and IBM DB2, Entity Framework, JavaScript/jQuery, engineering practices, project scenarios and HR rounds.

## Use it

Open the live site (GitHub Pages) or download this repo and open `index.html` in any browser. No build step, no install.

"Understood" and "Review later" marks are saved in your own browser only.

## Structure

```
index.html          home page: modules, topics, plan
prepare.html        study page: daily Q&A, coding, SQL, revision
assets/style.css    styles (light and dark)
assets/app.js       rendering, tabs, search, marks
data/roadmap.js     the 45-day plan + published-day counter
data/modules.js     the 11 modules and their topics
data/day-01.js      Day 1 content (one file per day)
```

## Adding a day

1. Copy `data/day-01.js` to `data/day-NN.js` and change `DAYS[1]` to `DAYS[NN]`.
2. Add `<script src="data/day-NN.js"></script>` in `prepare.html` before `assets/app.js`.
3. In `data/roadmap.js`, bump `PUBLISHED` and `QCOUNT`.

New days are added as the preparation progresses.
