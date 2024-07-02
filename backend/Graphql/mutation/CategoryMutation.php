<?php

use App\Models\Category;
use GraphQL\Type\Definition\Type;

$categoryMutations = [
    'addCategory'=>[
        'type'=>$categoryType,
        'args'=>[
            'name'=>Type::nonNull(Type::string()),
        ],
        'resolve'=> function($root, $args){
            $category = new Category([
                'name' => $args['name']
            ]);
            $category -> save();
            return $category->toArray();
        }
    ],
];