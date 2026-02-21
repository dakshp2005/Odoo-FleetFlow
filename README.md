# FleetFlow — Intelligent Fleet Management System

<div align="center">

**A modern, AI-powered fleet and logistics management dashboard built with Next.js, Supabase, and shadcn/ui.**

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Auth_&_DB-3ECF8E?logo=supabase&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-Components-000?logo=shadcnui)

</div>

---

## Overview

FleetFlow is a comprehensive fleet management platform designed for logistics companies, transport businesses, and fleet operators of all sizes. It provides real-time visibility into vehicles, trips, drivers, maintenance schedules, and expenses — all from a single, unified dashboard.

An embedded **AI Assistant** powered by Google Gemini can query fleet data, create records, update statuses, and generate operational insights through simple natural language conversations — no technical expertise required.

---

## Features

| Module                    | Description                                                                                        |
| ------------------------- | -------------------------------------------------------------------------------------------------- |
| **Command Center**        | sAt-a-glance KPI cards, fleet status donut chart, and recent trips overview                         |
| **Vehicle Registry**      | Full CRUD for fleet vehicles with real-time status tracking (Available, On Trip, In Shop, Retired) |
| **Trip Dispatcher**       | Create, assign, and monitor deliveries with cargo weight, route details, and live status updates   |
| **Driver Management**     | Track driver profiles, license expiry dates, safety scores, and complaint records                  |
| **Maintenance Logs**      | Schedule and log service records linked to specific vehicles with cost tracking                    |
| **Expense & Fuel Logs**   | Record fuel costs, tolls, and miscellaneous expenses per trip for full cost visibility             |
| **Analytics & Reports**   | Monthly revenue charts, fuel efficiency tables, vehicle ROI analysis, and financial summaries      |
| **AI Assistant**          | Natural language chat panel — query data, create records, and get actionable insights instantly    |
| **Secure Authentication** | Email/password sign-in & sign-up with full profile collection and route-level protection           |

---

## Tech Stack

| Layer                  | Technology                                            |
| ---------------------- | ----------------------------------------------------- |
| **Framework**          | Next.js 14 (App Router)                               |
| **Language**           | TypeScript                                            |
| **Styling**            | Tailwind CSS + shadcn/ui (New York style, Zinc theme) |
| **UI Primitives**      | Radix UI + Class Variance Authority (CVA)             |
| **Auth & Database**    | Supabase (PostgreSQL + Row Level Security + Auth)     |
| **State Management**   | TanStack React Query                                  |
| **Forms & Validation** | React Hook Form + Zod                                 |
| **Charts**             | Recharts                                              |
| **AI**                 | Vercel AI SDK + Google Gemini 2.0 Flash               |
| **Icons**              | Lucide React                                          |

---

## Benefits & Advantages

### For Fleet Operators

- **Single Dashboard** — Monitor your entire fleet from one place instead of juggling spreadsheets and disconnected tools
- **Real-Time Status Tracking** — Know exactly which vehicles are available, on trip, or in maintenance at any moment
- **Cost Transparency** — Track every expense, fuel fill, and maintenance cost down to the individual trip level

### For Decision Makers

- **Data-Driven Insights** — Revenue charts, ROI analysis, and fuel efficiency reports help optimize fleet utilization
- **Financial Summaries** — Monthly breakdowns of income vs expenses for clear profitability visibility
- **Driver Performance Metrics** — Safety scores and complaint tracking to maintain service quality

### AI-Powered Operations

- **Natural Language Queries** — Ask questions like _"Which vehicles are due for maintenance?"_ and get instant answers
- **Hands-Free Record Creation** — Tell the AI to _"Add a new trip from Mumbai to Delhi"_ without touching a form
- **Instant Analysis** — Request summaries and trends without navigating through multiple report screens

### Technical Advantages

- **Type-Safe End-to-End** — Full TypeScript coverage from database types to UI components eliminates runtime errors
- **Server-Side Rendering** — Next.js App Router provides fast page loads and SEO-friendly rendering
- **Row Level Security** — Supabase RLS ensures data isolation and security at the database level
- **Responsive Design** — Fully mobile-responsive layout with collapsible sidebar and touch-friendly interactions
- **Modern Component Library** — shadcn/ui with Radix primitives ensures accessibility (ARIA) and consistent UX
- **Optimistic Updates** — TanStack React Query provides instant UI feedback with background sync

---

## AI Assistant

The embedded AI assistant uses **Google Gemini 2.0 Flash** via the Vercel AI SDK. It can:

- **Query** fleet data — _"Which vehicles are currently available?"_
- **Create** records — _"Add driver Ravi Kumar with license DL-XX-2027"_
- **Update** statuses — _"Mark Trip #42 as completed"_
- **Analyze** data — _"Show me fuel efficiency for last month"_

The assistant operates with secure server-side data access, ensuring sensitive operations are never exposed to the client.

---

## Team

**Daksh Patel** — [@dakshp2005](https://github.com/dakshp2005)_
**Bhautik Vaghamshi** — [@bhautik-2004](https://github.com/bhautik-2004)_
**Vashisht Brahmbhatt** — [@vdb24](https://github.com/vdb24)_

