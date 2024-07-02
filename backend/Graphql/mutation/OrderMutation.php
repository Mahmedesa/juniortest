<?php

use App\Models\OOI;
use App\Models\Order;

use GraphQL\Type\Definition\Type;

$orderMutations = [
    'addorder' => [
        'type' => $orderType,
        'args' => [
            'payment_method'=>Type::nonNull(Type::string()),
            'address'=>Type::nonNull(Type::string()),
            'items'=>Type::listOf(Type::int())
        ],
        'resolve' => function ($root, $args) {
            $order = new Order();
            $order->address = $args['address'];
            $order->payment_method = $args['payment_method'];
            $order -> save();

            $orderId = $order->id;

            foreach ($args['items'] as $orderItemId) {
                $ooi = new OOI(); 
                $ooi->order_id = $orderId;
                $ooi->orderitem_id = $orderItemId;
                $ooi->save();
            }
            return [
                'id'=> $orderId,
                'address'=>$args['address'],
                'payment_method'=>$args['payment_method']
            ];
        }
    ]
];
