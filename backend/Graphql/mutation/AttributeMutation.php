<?php

use App\Models\Attribute;
use GraphQL\Type\Definition\Type;

$attributeMutations = [
    'addattribute'=>[
        'type'=>$attributeType,
        'args'=>[
            'id' => Type::string(),
            'product_id' => Type::string(),
            'name' => Type::string(),
            'value' => Type::string(),
            'displayValue' => Type::string(),
        ],
        'resolve'=> function($root, $args){
            $attribute = new Attribute([
                'id' => Type::string(),
                'product_id' => $args['product_id'],
                'name' => $args['name'],
                'value' => $args['value'],
                'displayValue' => $args['displayValue'],
            ]);
            $attribute -> save();
            return $attribute->toArray();
        }
    ],
];