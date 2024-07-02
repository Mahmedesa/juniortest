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
use App\Models\ProductAttribute;
use GraphQL\Type\Definition\ObjectType;
use GraphQL\Type\Definition\Type;

$rootquery = new ObjectType([
    'name'=>'Query',
    'fields'=>[
        'categories'=> [
            'type'=>Type::listOf($categoryType),
            'resolve'=>function ($root,$args){
                $categories = Category::get()->toArray();
                return $categories;
            }
        ],
        'productattributes'=> [
            'type'=>Type::listOf($productattributeType),
            'resolve'=>function ($root,$args){
                $productattributes = PA::get()->toArray();
                return $productattributes;
            }
        ],
        'products'=>[
            'type'=>Type::listOf($productType),
            'resolve'=>function ($root,$args){
                $products = Product::get()->toArray();
                return $products;
            }
        ],
        'attributes'=>[
            'type'=>Type::listOf($attributeType),
            'resolve'=>function ($root,$args){
                $attributes = Attribute::get()->toArray();
                return $attributes;
            }
        ],
        'pais'=>[
            'type'=>Type::listOf($paiType),
            'resolve'=>function ($root, $args){
               return  PAI::get()->toArray();
            }
        ],
        'oiais'=>[
            'type'=>Type::listOf($oiaiType),
            'resolve'=>function ($root, $args){
               return  OIAI::get()->toArray();
            }
        ],
        'oois'=>[
            'type'=>Type::listOf($ooiType),
            'resolve'=>function ($root, $args){
               return  OOI::get()->toArray();
            }
        ],
        'category' => [
            'type' => $categoryType,
            'args' => [
                'id' => Type::nonNull(Type::int())
            ],
            'resolve' => function($root, $args) {
                error_log('Category ID: ' . $args['id']);
                return Category::find($args['id'])->toArray();
            }
        ],
        'product' => [
            'type' => $productType,
            'args' => [
                'id' => Type::nonNull(Type::int())
            ],
            'resolve' => function($root, $args) {
                error_log('Product ID: ' . $args['id']);
                return Product::find($args['id'])->toArray();
            }
        ],
        'attribute'=>[
            'type'=>$attributeType,
            'args'=>[
                'id'=> Type::nonNull(Type::int())
            ],
            'resolve'=> function($root,$args){
                $attribute = Attribute::find($args["id"])->toArray();
                return $attribute;
            }
        ],
        'gallery'=>[
            'type'=>$galleryType,
            'args'=>[
                'id'=> Type::nonNull(Type::int())
            ],
            'resolve'=> function($root,$args){
                $gallery = Gallery::find($args["id"])->toArray();
                return $gallery;
            }
        ],
        'attributeitem'=>[
            'type'=>$attributeitemType,
            'args'=>[
                'id'=> Type::nonNull(Type::string())
            ],
            'resolve'=> function($root,$args){
                $attributeitem = AttributeItem::find($args["id"])->toArray();
                return $attributeitem;
            }
        ],
        "productattribute"=>[
            'type'=>$productattributeType,
            'args'=>[
                'id'=>Type::nonNull(Type::int())
            ],
            function($root, $args){
                $productattribute = PA::find($args["id"])->toArray();
                return $productattribute;
            } 
        ],
        "pai"=>[
            'type'=>$paiType,
            'args'=>[
                'id'=>Type::nonNull(Type::int())
            ],
            function($root, $args){
                $pai = PAI::find($args["id"])->toArray();
                return $pai;
            } 
        ],
        "oiai"=>[
            'type'=>$oiaiType,
            'args'=>[
                'id'=>Type::nonNull(Type::int())
            ],
            function($root, $args){
                $oiai = OIAI::find($args["id"])->toArray();
                return $oiai;
            } 
        ],
        "ooi"=>[
            'type'=>$ooiType,
            'args'=>[
                'id'=>Type::nonNull(Type::int())
            ],
            function($root, $args){
                $ooi = OOI::find($args["id"])->toArray();
                return $ooi;
            } 
        ],
        'orderitems'=>[
            'type'=>Type::listOf($orderitemType),
            'resolve'=>function ($root, $args){
               return  OrderItem::get()->toArray();
            }
        ],
        'attributeitems'=>[
            'type'=>Type::listOf($attributeitemType),
            'resolve'=>function ($root, $args){
               return  AttributeItem::get()->toArray();
            }
        ],
        "orderitem"=>[
            'type'=>$orderitemType,
            'args'=>[
                'id'=>Type::nonNull(Type::int())
            ],
            function($root, $args){
                $orderitem = OrderItem::find($args["id"])->toArray();
                return $orderitem;
            } 
        ],
        'orders'=>[
            'type'=>Type::listOf($orderType),
            'resolve'=>function ($root, $args){
                return Order::get()->toArray();
            }
        ],
        'order'=>[
            'type'=>$orderType,
            'args'=>[
                'id'=>Type::nonNull(Type::int())
            ],
            function($root, $args){
                $order = Order::find($args['id'])->toArray();
            }
        ]
    ]
]);