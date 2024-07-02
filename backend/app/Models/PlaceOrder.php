<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlaceOrder extends Model{
    protected $table = "placeorder";
    public $timestamps = false;
    protected $fillable = ['orders_id','address','payment_method','order_id'];
    
    public function order(){
        return $this->belongsTo(Order::class);
    }
}