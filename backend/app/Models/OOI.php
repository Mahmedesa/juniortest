<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class OOI extends Model{
   protected $table = 'o_oi';
   public  $timestamps = false;
   protected $fillable = ['order_id','orderitem_id'];

   public function order(){
    return $this->belongsTo(Order::class);
   }

   public function orderitem(){
    return $this->belongsTo(OrderItem::class);
   }
}
