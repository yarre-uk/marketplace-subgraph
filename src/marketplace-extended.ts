import {
  OrderCreated as OrderCreatedEvent,
  OrderProcessed as OrderProcessedEvent,
} from "../generated/MarketplaceExtended/MarketplaceExtended"
import {
  Order
} from "../generated/schema"

enum OrderStatus {
  Created,
  Processed,
  Canceled,
}

export function handleOrderCreated(event: OrderCreatedEvent): void {
  let entity = new Order(
    event.params.id
  )

  entity.MarketplaceExtended_id = event.params.id
  entity.sender = event.params.sender
  entity.orderType = event.params.orderType
  entity.orderStatus = OrderStatus.Created;

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOrderProcessed(event: OrderProcessedEvent): void {
  let entity = Order.load(event.params.id)

  if (entity == null) {
    throw new Error("Order not found");
  }

  entity.orderStatus = event.params.state as OrderStatus;
  entity.save();
}