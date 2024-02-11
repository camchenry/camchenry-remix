---
title: "How Serverless Saved Money on My Heating Bill"
summary: "I built a serverless application as a weekend project to help me save money on my heating bill. In doing so, I experienced something great about building websites in 2022."
publishedAt: "2022-01-04"
tags:
  - serverless
  - remix
published: true
---

<img src="/images/13af599c-6ef7-48f1-2b86-5c9ff7178800.avif" alt="A picture of burning money." width="650" height="433">

Currently, it's winter in the Northeastern United States, where I live. That means it gets uncomfortably cold outside. That means one big thing for everyone living here: figuring out how to keep our homes warm without literally burning money.

Where I live, the only viable heating option right now is burning propane.

Unfortunately, propane is more expensive now in the US than it has been at any time in the past 5 years.[^1]

Naturally, this meant that I wanted to save some money on my heating bill this year, if possible. The only way to do that is to reduce the amount of propane I burned by reducing the amount of heat I need to produce.

The problem is that I can't measure how much heat I need to produce, **I can only measure how much propane I have used.** The company that supplies propane to us provides a dashboard where I can check how much propane is in the tank.

Sadly, the dashboard only shows the _current_ level of propane in the tank, but doesn't show the propane used per day, or any sort of historical data.

**It's hard to improve what isn't measured**.

So, to know whether more insulation or other efficiency improvements are actually saving money, I needed to start tracking the data.

## The Solution

When faced with a problem, I did what any software engineer would do: build a full-stack web application deployed to the edge using the hottest JavaScript framework.

The idea was to build a web application to periodically scrape the current level of propane in the tank, then store that in a database, and use the stored information to compute consumption rate and display historical data.

That meant I needed to pick:

- a scraping tool (for fetching the current gas level)
- a database (for storing the data)
- a framework (for interacting with the database and rendering pages)
- a host (for hosting the whole application)

So, I decided to use:

- Scraping: [Browserless](https://www.browserless.io/)
- Database: [Supabase](https://supabase.com/)
- Web framework: [Remix](https://remix.run/)
- Hosting: [Fly.io](https://fly.io/)

Here is a diagram that shows the architecture of the application:

<figure>
  <img src="/images/43ccdeae-066d-4d9f-38ce-fc542f4c7c00.avif" alt="Architecture diagram of the gas tracking application. The client interacts with the Remix application, which runs within Fly.io, via GET and POST requests to view the dashboard and fetch new data. The Remix application also interacts with the external services Browserless and Supabase to fetch the new data and store it." height="201" width="650" />
  <figcaption>Architecture diagram of the gas tracking application, which shows how Remix coordinates rendering pages for our client, receiving fetch requests, scraping webpages, and updating the database.</figcaption>
</figure>

### Scraping tool: Browserless

For the scraping tool, I chose to use [Browserless](https://www.browserless.io/) which I wanted to try in a real-world scenario. It's essentially Puppeteer-as-a-Service, so you don't need to worry about installing Chromium or anything. Just install the [puppeteer](https://pptr.dev/) library, connect to Browserless, and start scraping.

It includes 20,000 CPU seconds for free, beyond which you have to start paying, but the free allotment of CPU time was more than enough for this project.

### Database: Supabase

I chose to use [Supabase](https://supabase.com/) as my database, because I wanted to use PostgreSQL as the database since I like schemas and everything that SQL affords. However, I didn't want the bother of hosting the database myself, getting it set up, maintaining it, and so on.

**I just wanted to get a database running as quickly as possible so I could build my application. Supabase was perfect for that.**

### Framework: Remix

I was an early supporter of [Remix](https://remix.run), because I think it's a great framework that has the potential to dramatically change the face of JavaScript web development. It lets you have fast server-rendered web pages without having to give up building an awesome user interface with JavaScript. There's a lot to say about it, but I'll leave that for another time.

Suffice to say, **this project probably wouldn't be possible without Remix**.

Remix lets me build a _true_ full-stack JavaScript application quickly and easily without having to give up the benefits of a complex client-side application, or the benefits of a server, such as querying a database, implementing authentication, and so on.

These things are possible with other frameworks, but there are more limitations to where it can be deployed and what sorts of libraries can be imported, and how they can be used.

For this project, Remix will orchestrate rendering the pages with React, scraping the latest data on a `POST` request, and fetching historical data from Supabase.

### Host: Fly.io

In the spirit of trying another new service, I chose to use [Fly.io](https://fly.io/) as my hosting provider. It's been a great experience so far, and the [underlying technology](https://github.com/firecracker-microvm/firecracker) is impressive, allowing for a secure, efficient, and fast serverless environment. This allows it to be deployed all over the world, close to where your users lives so your web application is faster.

Remix also comes with a Fly.io deployment template, which means you can deploy your application anywhere in the world in just a few minutes after creating your application.

## The Result

Putting all of these serverless services together, I was able to build my gas-tracking application over a weekend (while on a bus!) and deploy it for my own personal use.

<figure>
  <img src="/images/67187615-d70d-46d3-6c01-53d7da41c300.avif" alt="A picture of the gas tracking dashboard, which shows various metrics like current gas level, gas consumption per day, and number of days remaining until the tank is empty. There is also a chart that shows historical gas tank data from the last month." height="432" width="650" />
  <figcaption>The dashboard for the gas tracking application, which helps me gauge how much heat is being used and how effectively different house work affects our heating bill.</figcaption>
</figure>

So far, using this application, I've been able to realize hundreds of dollars in savings on our heating bill and accurately measure how much propane is used.

Something I didn't expect is that **this project cost me nothing at all**, except for the time it took to develop it. The framework is free. All of the libraries I used are open source and free. The application hosting on Fly.io is free, and I got a free randomly generated `fly.dev` domain name with HTTPS. Even the database and scraping tool are free for the amount that I use them.

## Take-away

Hopefully you have figured out by now that this article isn't really about how to save money on your heating bill.

This is an article about how **building a serverless application is easier and better than ever in 2022**.

Edge-focused web frameworks like [Remix](https://remix.run/) make it easy to build full-stack web applications that can be deployed to hosts like [Fly.io](https://fly.io/) and run anywhere in the world for free. In addition, services like [Supabase](https://supabase.com/) make it easy to build a production-ready application in a short amount of time.

Now is a better time than ever to start building a website.

<blockquote>
<p>While there's absolutely a learning curve to getting started, once you've got momentum, modern web development feels like having rocket boosters. The distance between idea and execution is as short as it's ever been.</p><cite>— Simeon Griggs, <a href="https://www.simeongriggs.dev/there-has-never-been-a-better-time-to-build-websites" rel="noopener noreferrer" target="_blank">There has never been a better time to build a website</a></cite>
</blockquote>

Even compared to a few years ago, there are far more capabilities available today to developers and at a substantially lower cost.

You don't need a dedicated server. You don't need a domain name. You don't need to be an expert. You don't even have to write code!

Right now is a great time to be a web developer. So let's get out there, lift each other up, and build great things!

> A rising tide lifts all boats

[^1]: Source for propane price: <https://ycharts.com/indicators/us_residential_propane_price>.
