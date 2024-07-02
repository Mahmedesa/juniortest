<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class OIAI extends Model{
    protected $table = "oi_ai";
    public $timestamps = false;
    protected $fillable = ['orderitem_id','attributeitem_id'];

    public function orderitem(){
        return $this->belongsTo(OrderItem::class);
    }

    public function attributeitem()
    {
        return $this->belongsTo(AttributeItem::class);
    }
}