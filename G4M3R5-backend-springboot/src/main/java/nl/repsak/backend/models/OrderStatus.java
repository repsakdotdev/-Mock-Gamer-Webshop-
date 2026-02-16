package nl.repsak.backend.models;

/**
 * Enum representing the different states an order can be in throughout its lifecycle.
 */
public enum OrderStatus {
    /**
     * Order has been created but not yet processed
     */
    PENDING,

    /**
     * Order is being processed by staff
     */
    PROCESSING,

    /**
     * Order has been shipped and is on its way to the customer
     */
    SHIPPED,

    /**
     * Order has been successfully delivered to the customer
     */
    DELIVERED,

    /**
     * Order has been canceled
     */
    CANCELED
}
