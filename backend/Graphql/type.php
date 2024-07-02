<?php

use App\Models\AAI;
use App\Models\Attribute;
use App\Models\AttributeItem;
use App\Models\Category;
use App\Models\Gallery;
use App\Models\OIAI;
use App\Models\OOI;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\PA;
use App\Models\PAI;
use App\Models\PlaceOrder;
use App\Models\Product;
use GraphQL\Type\Definition\InputObjectType;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;


$categoryType = new ObjectType([
    'name' => 'Category',
    'fields' => function () use (&$productType) {
        return [
            'id' => Type::nonNull(Type::int()),
            'name' => Type::string(),
            'products' => [
                'type' => Type::listOf($productType),
                'resolve' => function ($root, $args) {
                    return Product::where('category_id', $root['id'])->get()->toArray();
                }
            ]
        ];
    }
]);

$productType = new ObjectType([
    'name' => 'Product',
    'fields' => function () use (&$galleryType, &$productattributeType, &$orderitemType) {
        return [
            'id' => Type::nonNull(Type::int()),
            'idname' => Type::string(),
            'name' => Type::string(),
            'inStock' => Type::boolean(),
            'category_id' => Type::int(),
            'image' => Type::string(),
            'description' => Type::string(),
            'price' => Type::float(),
            'currency_label' => Type::string(),
            'currency_symbol' => Type::string(),
            'brand' => Type::string(),
            'galleries' => [
                "type" => Type::listOf($galleryType),
                "resolve" => function ($root, $args) {
                    $productId = $root['id'];
                    $product = Product::where('id', $productId)->with(['galleries'])->first();
                    return $product->galleries->toArray();
                }
            ],
            'productattributes' => [
                "type" => Type::listOf($productattributeType),
                "resolve" => function ($root, $args) {
                    $productId = $root['id'];
                    $product = Product::where('id', $productId)->with(['productattributes'])->first();
                    return $product->productattributes->toArray();
                }
            ],
            'orderitems' => [
                "type" => Type::listOf($orderitemType),
                "resolve" => function ($root, $args) {
                    $productId = $root['id'];
                    $product = Product::where('id', $productId)->with(['orderitems'])->first();
                    return $product->orderitems->toArray();
                }
            ],
        ];
    }
]);

$attributeType = new ObjectType([
    'name' => 'Attribute',
    'fields' => function () use (&$paiType, &$productattributeType) {
        return [
            'id' => Type::nonNull(Type::int()),
            'id_name' => Type::string(),
            'type' => Type::string(),
            'name' => Type::string(),
            'pais' => [
                "type" => Type::listOf($paiType),
                "resolve" => function ($root, $args) {
                    $attributeId = $root['id'];
                    $attribute = Attribute::where('id', $attributeId)->with(['pais'])->first();
                    return $attribute->pais->toArray();
                }
            ],
            'productattributes' => [
                "type" => Type::listOf($productattributeType),
                "resolve" => function ($root, $args) {
                    $attributeId = $root['id'];
                    $attribute = Attribute::where('id', $attributeId)->with(['productattributes'])->first();
                    return $attribute->productattributes->toArray();
                }
            ]
        ];
    }
]);

$attributeitemType = new ObjectType([
    'name' => 'AttributeItem',
    'fields' => function () use (&$paiType, &$oiaiType) {
        return [
            'id' => Type::nonNull(Type::int()),
            'value' => Type::string(),
            'display_value' => Type::string(),
            'pais' => [
                "type" => Type::listOf($paiType),
                "resolve" => function ($root, $args) {
                    $attributeitemId = $root['id'];
                    $attributeitem = AttributeItem::where('id', $attributeitemId)->with(['pais'])->first();
                    if ($attributeitem) {
                        return $attributeitem->pais->toArray();
                    } else {
                        return [];
                    }
                }
            ],
            'oiais' => [
                "type" => Type::listOf($oiaiType),
                "resolve" => function ($root, $args) {
                    $attributeitemId = $root['id'];
                    $attributeitem = AttributeItem::with('oiais')->find($attributeitemId);
                    return $attributeitem ? $attributeitem->oiais->toArray() : [];
                }
            ]
        ];
    }
]);


$galleryType = new ObjectType([
    'name' => 'Gallery',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'product_id' => Type::int(),
        'path' => Type::string(),
        'product' => [
            "type" => $productType,
            "resolve" => function ($root, $args) {
                $galleryId = $root['id'];
                $gallery = Gallery::where('id', $galleryId)->with(['product'])->first();
                return $gallery->product->toArray();
            }
        ]
    ]
]);

$productattributeType = new ObjectType([
    'name' => 'PA',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'product_id' => Type::int(),
        'attribute_id' => Type::int(),
        'product' => [
            "type" => $productType,
            "resolve" => function ($root, $args) {
                $productattributeId = $root['id'];
                $productattribute = PA::where('id', $productattributeId)->with(['product'])->first();
                return $productattribute->product->toArray();
            }
        ],
        'attribute' => [
            "type" => $attributeType,
            "resolve" => function ($root, $args) {
                $productattributeId = $root['id'];
                $productattribute = PA::where('id', $productattributeId)->with(['attribute'])->first();
                return $productattribute->attribute->toArray();
            }
        ]
    ]
]);

$paiType = new ObjectType([
    'name' => 'PAI',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'attributeitem_id' => Type::int(),
        'attribute_id' => Type::int(),
        'attribute' => [
            "type" => $attributeType,
            "resolve" => function ($root, $args) {
                $paiId = $root['id'];
                $pai = PAI::with('attribute')->find($paiId);
                return $pai ? $pai->attribute->toArray() : null;
            }
        ],
        'attributeitem' => [
            "type" => $attributeitemType,
            "resolve" => function ($root, $args) {
                $paiId = $root["id"];
                $pai = PAI::with('attributeitem')->find($paiId);
                return $pai ? $pai->attributeitem->toArray() : null;
            }
        ]
    ]
]);


$orderType = new ObjectType([
    'name' => 'Order',
    'fields' => function () use (&$ooiType) {
        return [
            'id' => Type::nonNull(Type::int()),
            'address' => Type::string(),
            'payment_method' => Type::string(),
            'total_price' => [
                'type' => Type::float(),
                'resolve' => function ($root) {
                    $order = Order::find($root['id']);
                    $order->updateTotalPrice();
                    return $order? $order->total_price : null;
                }
            ],
            'oois' => [
                'type' => Type::listOf($ooiType),
                'resolve' => function ($root, $args) {
                    $order = Order::where('id', $root['id'])->with(['oois'])->first();
                    return $order->oois->toArray();
                }
            ]
        ];
    }
]);

$orderitemType = new ObjectType([
    'name' => 'OrderItem',
    'fields' => function () use (&$oiaiType, &$productType, &$ooiType) {
        return [
            'id' => Type::nonNull(Type::int()),
            'product_id' => Type::int(),
            'quantity' => Type::int(),
            'total_price' => [
                'type' => Type::float(),
                'resolve' => function ($root) {
                    $product = Product::find($root['product_id']);
                    return $product ? $root['quantity'] * $product->price : 0;
                }
            ],
            'product' => [
                'type' => $productType,
                'resolve' => function ($root, $args) {
                    $orderitem = OrderItem::find($root['id']);
                    return $orderitem->product->toArray();
                }
            ],
            'oiais' => [
                'type' => Type::listOf($oiaiType),
                'resolve' => function ($root, $args) {
                    $oiais = OIAI::where('orderitem_id', $root['id'])->get();
                    return $oiais->isNotEmpty() ? $oiais->toArray() : [];
                }
            ],
            'oois' => [
                'type' => Type::listOf($ooiType),
                'resolve' => function ($root, $args) {
                    $orderitem = OrderItem::where('id', $root['id'])->with(['oois'])->first();
                    return $orderitem ? $orderitem->oois->toArray() : [];
                }
            ]
        ];
    }
]);

$oiaiType = new ObjectType([
    'name' => 'OIAI',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'attributeitem_id' => Type::int(),
        'orderitem_id' => Type::int(),
        'attributeitem' => [
            'type' => $attributeitemType,
            'resolve' => function ($root, $args) {
                $oiai = OIAI::where('id', $root['id'])->with(['attributeitem'])->first();
                return $oiai ? $oiai->attributeitem->toArray() : null;
            }
        ],
        'orderitem' => [
            'type' => $orderitemType,
            'resolve' => function ($root, $args) {
                $oiai = OIAI::where('id', $root['id'])->with(['orderitem'])->first();
                return $oiai ? $oiai->orderitem->toArray() : null;
            }
        ]
    ]
]);

$ooiType = new ObjectType([
    'name' => 'OOI',
    'fields' => [
        'id' => Type::nonNull(Type::int()),
        'order_id' => Type::nonNull(Type::int()),
        'orderitem_id' => Type::nonNull(Type::int()),
        'order' => [
            'type' => $orderType,
            'resolve' => function ($root, $args) {
                $ooi = OOI::where('id', $root['id'])->with(['order'])->first();
                return $ooi ? $ooi->order->toArray() : null;
            }
        ],
        'orderitem' => [
            'type' => $orderitemType,
            'resolve' => function ($root, $args) {
                $ooiId = $root['id'];
                $ooi = OOI::where('id', $ooiId)->with(['orderitem'])->first();
                return $ooi ? $ooi->orderitem->toArray() : null;
            }
        ]
    ]
]);
