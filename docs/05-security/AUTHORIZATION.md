# Authorization & Access Control — LevUp Projects

**Document Status:** Baseline  
**Model:** Role-Based Access Control (RBAC) + Row-Level Security (RLS)  
**Last Updated:** 2026-11-17  

---

## 1. Role Hierarchy

```
       [ Anonymous Visitor ]
                 │
         (Registers / Logs in)
                 ▼
          [ Student Buyer ]
                 │
       (Explicit Allowlist in admin_users)
                 ▼
         [ Staff / Admin ]
                 │
                 ├── [ QA Engineer ] (Review deliverables, approve test reports)
                 ├── [ Support Staff ] (Manage tickets, customer messages)
                 └── [ Superadmin ] (Manage catalog, process refunds, manage admins)
```

---

## 2. Resource Permission Matrix

| Resource | Anonymous | Student Buyer | Staff / Admin |
|---|---|---|---|
| Public Catalog (`/projects`) | Read | Read | Read / Write |
| Project Detail & Diagrams | Read | Read | Read / Write |
| Shopping Cart | Read / Write (Local) | Read / Write | Read / Write |
| Personal Orders & Invoices | None | Read (Own only) | Read (All) |
| Download Deliverable Files | None | Read (Entitled only) | Read (All) / Upload |
| Submit Revision Request | None | Create (Entitled only) | Review / Resolve |
| Admin Operations Portal | None | None | Full Access |
| Financial Reconciliation Logs | None | None | Read / Process |
