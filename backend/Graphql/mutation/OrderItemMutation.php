<?php

use App\Models\OIAI;
use App\Models\OrderItem;
use GraphQL\Type\Definition\Type;

$orderitemMutations = [
    'addorderitem' => [
        'type' => $orderitemType, 
        'args' => [
            'product_id' => Type::nonNull(Type::int()),
            'attributes' => Type::listOf(Type::int()), 
            'quantity' => Type::nonNull(Type::int()),
        ],
        'resolve' => function ($root, $args) {
            
            $orderItem = new OrderItem();
            $orderItem->product_id = $args['product_id'];
            $orderItem->quantity = $args['quantity'];
            $orderItem->save();
            $orderItemId = $orderItem->id;
            foreach ($args['attributes'] as $attributeItemId) {                
                $oiai = new OIAI(); 
                $oiai->orderitem_id = $orderItemId;
                $oiai->attributeitem_id = $attributeItemId;
                $oiai->save();
            }
            return [
                'id' => $orderItemId,
                'product_id' => $args['product_id'],
                'quantity' => $args['quantity'],
            ];
        },
    ],
    'editorderitem' => [
        'type' => $orderitemType,
        'args' => [
            'id' => Type::nonNull(Type::int()),
            'quantity' => Type::nonNull(Type::int()),
            'attributes' => Type::listOf(Type::int()),
        ],
        'resolve' => function ($root, $args) {
            $orderItem = OrderItem::find($args['id']);
            if (!$orderItem) {
                throw new \Exception('OrderItem not found');
            }

            $orderItem->quantity = $args['quantity'];
            $orderItem->save();

            OIAI::where('orderitem_id', $orderItem->id)->delete();

            foreach ($args['attributes'] as $attributeItemId) {
                $oiai = new OIAI();
                $oiai->orderitem_id = $orderItem->id;
                $oiai->attributeitem_id = $attributeItemId;
                $oiai->save();
            }

            return $orderItem->toArray();
        }
    ],
    'deleteorderitem' => [
        'type' => $orderitemType,
        'args' => [
            'id' => Type::nonNull(Type::int()),
        ],
        'resolve' => function ($root, $args) {
            error_log('Deleting order item with id: ' . $args['id']);

            $orderItem = OrderItem::find($args['id']);
            if (!$orderItem) {
                throw new \Exception('OrderItem not found');
            }

            $orderItem->delete();
            return $orderItem->toArray();
        }
    ]

];
