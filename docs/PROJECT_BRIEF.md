# Smart Commerce AI
## Project Brief (MVP)

**Version:** 1.0.0  
**Status:** MVP Planning  
**Author:** Founder  
**Target Market:** Libya (Phase 1)

---

# 1. Executive Summary

Smart Commerce AI is a SaaS platform designed to help small and medium-sized businesses manage sales received through social media.

The first version focuses on Facebook Messenger, allowing businesses to automate customer conversations using AI and n8n while managing products, inventory, customers, orders, and reports from a single platform.

The platform acts as the **Single Source of Truth**, ensuring that all business data and logic are centralized, secure, and independent from external automation tools.

---

# 2. Vision

To become the leading Social Commerce Management Platform in Libya and later expand across the MENA region by enabling businesses to sell, manage, and automate orders from multiple social media channels through one unified platform.

---

# 3. Problem Statement

Many businesses in Libya sell products through Facebook Messenger.

Most of them face several operational problems:

- Orders are handled manually.
- Inventory is tracked using paper or spreadsheets.
- Products may be sold even when out of stock.
- Customer information is not organized.
- Sales reports are unavailable.
- Employees spend significant time answering repetitive questions.
- No centralized dashboard exists for managing social media sales.

These issues reduce efficiency, increase human errors, and negatively affect customer satisfaction.

---

# 4. Proposed Solution

Smart Commerce AI centralizes the entire sales process.

Instead of manually responding to customers and checking inventory, businesses connect Messenger to n8n and AI.

The AI communicates with customers, checks inventory through the platform, creates pending orders, and sends them to the sales team for approval.

After approval, inventory updates automatically and sales reports are generated instantly.

---

# 5. Product Objectives

The MVP aims to:

- Simplify selling through Messenger.
- Reduce manual work.
- Prevent selling unavailable products.
- Centralize business operations.
- Improve sales tracking.
- Build a scalable SaaS platform.
- Validate product-market fit in Libya.

---

# 6. Target Market

### Phase 1

Libya

### Business Types

- Clothing Stores
- Electronics Stores
- Cosmetic Shops
- Perfume Shops
- Mobile Shops
- Grocery Stores
- Small Retail Businesses
- Home Businesses
- Instagram & Facebook Sellers

---

# 7. Target Users

## Workspace Owner

Owns the business.

Can manage everything.

---

## Sales Employee

Reviews and approves customer orders.

Communicates with customers when needed.

---

## Inventory Employee

Manages products and inventory.

Updates stock quantities.

---

## Platform Administrator

Manages subscriptions, workspaces, and system configuration.

---

# 8. MVP Scope

Included Modules:

- Authentication
- Workspace Management
- Dashboard
- Products
- Inventory
- Customers
- Orders
- Reports
- Team Members
- Facebook Messenger Integration
- n8n Integration
- Subscription Plans
- Settings
- Audit Logs

---

# 9. Out of Scope

The following features are NOT included in the MVP:

- WhatsApp
- Instagram
- TikTok
- Telegram
- Snapchat
- YouTube
- Ecommerce Website
- POS System
- Accounting
- Supplier Management
- Shipping Integration
- Online Payments
- Product Images
- Mobile Applications
- AI Analytics

These features are planned for future releases.

---

# 10. Core Workflow

Customer sends a message through Facebook Messenger.

↓

AI receives the message through n8n.

↓

AI requests product availability from Smart Commerce AI.

↓

Platform checks inventory.

↓

Platform returns availability.

↓

AI informs the customer.

↓

Customer confirms the purchase.

↓

Platform creates a new order.

↓

Order Status = Pending.

↓

Sales Employee reviews the order.

↓

If Approved:

- Order becomes Approved.
- Inventory decreases automatically.
- Reports update automatically.
- Customer receives confirmation.

If Rejected:

- Order becomes Rejected.
- Inventory remains unchanged.

---

# 11. Business Rules

- Inventory decreases only after approval.
- AI never writes directly to the database.
- n8n is responsible only for automation.
- Business logic remains inside the platform.
- Every workspace owns isolated data.
- Every important action creates an Audit Log.
- Deleted products cannot exist in active orders.
- Reports update automatically after approved orders.
- Every order belongs to exactly one workspace.

---

# 12. Platform Architecture

The platform is designed around Multi-Tenant SaaS architecture.

Each Workspace has isolated:

- Users
- Products
- Inventory
- Customers
- Orders
- Reports
- Settings

No data sharing exists between workspaces.

---

# 13. AI Strategy

The AI is responsible only for conversations.

Responsibilities:

- Answer customer questions.
- Check availability.
- Collect customer information.
- Create order requests.

The AI cannot:

- Modify inventory.
- Approve orders.
- Delete records.
- Execute business logic.

---

# 14. n8n Strategy

n8n acts as the automation engine.

Responsibilities:

- Receive Messenger messages.
- Communicate with AI.
- Connect external services.
- Trigger workflows.

Business logic always remains inside Smart Commerce AI.

---

# 15. SaaS Business Model

The platform operates using monthly subscriptions.

Every business creates its own workspace.

Different subscription plans provide different usage limits and features.

A free trial (3–7 days) allows users to evaluate the platform before subscribing.

---

# 16. Technology Stack

Frontend

- Next.js 15
- TypeScript
- Tailwind CSS
- HeroUI

Backend

- Next.js Server Actions
- Prisma ORM
- PostgreSQL

Automation

- n8n

Authentication

- NextAuth

Validation

- Zod
- React Hook Form

Hosting

- VPS (Production)

---

# 17. Success Metrics

The MVP will be considered successful if it achieves:

- Businesses can manage inventory digitally.
- Orders are processed faster.
- Inventory accuracy improves.
- Manual work decreases.
- Businesses actively use the platform daily.
- Customers successfully subscribe after the trial period.

---

# 18. Future Vision

After validating the MVP, Smart Commerce AI will evolve into a complete Omnichannel Commerce Platform.

Future releases may include:

- WhatsApp Integration
- Instagram Integration
- TikTok Integration
- Telegram Integration
- Snapchat Integration
- YouTube Integration
- Ecommerce Website Builder
- Online Payments
- Shipping Providers
- Mobile Applications
- AI Sales Assistant
- AI Analytics
- CRM
- Loyalty Programs
- Marketing Automation
- Public APIs
- Marketplace Integrations

---

# 19. Project Philosophy

Smart Commerce AI follows these principles:

- Simplicity over complexity.
- Automation without losing business control.
- Platform as the Single Source of Truth.
- Scalable SaaS architecture.
- Secure Multi-Tenant isolation.
- Modular architecture for future expansion.
- AI assists humans but never replaces business rules.

---

# 20. MVP Goal

The objective of the MVP is **not** to build the final platform.

The objective is to validate demand, acquire the first paying customers in the Libyan market, collect real feedback, and establish a scalable technical foundation for future growth.