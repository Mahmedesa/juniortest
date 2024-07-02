<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PA extends Model{
    protected $table = "productattributes";
    public $timestamps = false;
    protected $fillable = ['product_id','attribute_id'];

    public function product(){
        return $this->belongsTo(Product::class);
    }
    public function attribute(){
        return $this->belongsTo(Attribute::class);
    }
    public function attributes(){
        return $this->hasMany(Attribute::class);
    }
}