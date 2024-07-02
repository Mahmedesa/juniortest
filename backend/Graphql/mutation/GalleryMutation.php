<?php

use App\Models\Gallery;
use GraphQL\Type\Definition\Type;

$galleryMutations = [
    'addgallery'=>[
        'type'=>$galleryType,
        'args'=>[
            'product_id' => Type::string(),
            'path' => Type::string(),
        ],
        'resolve'=> function($root, $args){
            $gallery = new Gallery([
                'product_id' => $args['product_id'],
                'path' => $args['path'],
            ]);
            $gallery -> save();
            return $gallery->toArray();
        }
    ],
];