# calculateuaegratuity.com

UAE end-of-service gratuity, worked out to the letter of the law.

Live at [calculateuaegratuity.com](https://calculateuaegratuity.com)

## What it does

Anyone leaving a job in the UAE is owed a gratuity payment. What they get depends on contract
type, years served, and how the job ended. The rules sit in UAE Federal Decree-Law No. 33 of
2021, and the arithmetic changes at the five-year mark.

Enter salary, start date, end date and reason for leaving. You get the figure back with the
calculation shown, so you can check it instead of trusting it.

## Build notes

First site in the portfolio. One calculator on one page, plus the pages a real site needs to
be taken seriously: how it works, FAQ, about, contact, privacy, terms.

The lesson was commercial. I chose the keyword on search volume alone. The site ranks. It
earns nothing, because nobody searching that term is worth anything to an advertiser. Every
build after this one had to clear a cost-per-click floor before I bought the domain.

Reading the decree took longer than writing the code.

## Stack

Astro, Tailwind CSS, Cloudflare Pages.

```bash
npm install
npm run dev
```

## Accuracy

Rules read from the Federal Decree-Law and its amendments. Output is an estimate for
planning. Unusual contracts and disputed terminations need a lawyer, not a calculator.
