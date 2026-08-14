# Architectural Notes & Extension Points

This document outlines key technical decisions made during the refactoring and future extension points.

---

## Architecture & Security Decisions

1. **Decoupled Application Architecture**:
   - The application has been cleanly separated into an independent **NestJS backend (`BE/`)** and **Next.js 15 App Router frontend (`FE/`)**.
   - Next.js Route Handlers are not used for business/database logic. All business rules and MongoDB interactions remain strictly inside NestJS services.

2. **Atomic Inventory & Rollback Protection**:
   - Checkout uses atomic `findOneAndUpdate` with `$inc` and `$gte` conditions.
   - If stock update fails for any order item due to concurrent checkout, previous decrements are safely rolled back before returning an error to the customer.
   - Terminal order state transitions (`Cancelled`, `Failed Delivery`, `Returned`) trigger automatic stock replenishment.

3. **RBAC & Authorization**:
   - Server-side dynamic RBAC permission checking using `PermissionsGuard` and `@Permissions(...)` decorators.
   - Admin routes return HTTP 403 Forbidden if the user lacks the explicit permission string.
   - System roles (`super-admin`, `order-manager`, `product-manager`, `customer-service`, `inventory-manager`) cannot be deleted, and custom roles cannot be deleted if assigned to active admin accounts.

4. **Cash on Delivery (COD) Payment Interface**:
   - Designed with an abstract payment service design pattern (`PaymentMethod: 'COD'`).
   - Adding future online payment providers (e.g. Paymob, Stripe, Fawry) will only require registering a new payment strategy without altering core order processing logic.

---

## Extension Points & Future Roadmap

- **Shipping Courier API Integration**:
  - `ShippingService` can be extended with webhook handlers for shipping provider tracking status updates.
- **WhatsApp & SMS Notifications**:
  - Event emitters can be hooked into order status updates (`order.status_changed`) to trigger automated WhatsApp messages to customers.
- **Advanced Coupon & Discount Rules**:
  - Coupon model can be attached to `OrdersService.createOrder` for promo code validation.
- **Customer Wishlist & Product Reviews**:
  - Schema extension points for customer ratings and favorite items.
