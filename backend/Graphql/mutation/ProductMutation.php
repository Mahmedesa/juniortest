<?php

use App\Models\Product;
use GraphQL\Type\Definition\Type;

$productMutations = [
    'addproduct'=>[
        'type'=>$productType,
        'args'=>[
            'id' => Type::string(),
            'name' => Type::string(),
            'inStock' => Type::boolean(),
            'category' => Type::string(),
            'description' => Type::string(),
            'price' => Type::float(),
            'currency_label' => Type::string(),
            'currency_symbol' => Type::string(),
            'brand' => Type::string()
        ],
        'resolve'=> function($root, $args){
            $product = new Product([
                'id' => $args['id'],
                'name' => $args['name'],
                'inStock' => $args['inStock'],
                'category' => $args['category'],
                'description' => $args['description'],
                'price' => $args['price'],
                'currency_label' => $args['currency_label'],
                'currency_symbol' => $args['currency_symbol'],
                'brand' => $args['brand']
            ]);
            $product -> save();
            return $product->toArray();
        }
    ],
];