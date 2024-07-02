<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model{
    protected $table = "orders";
    public $timestamps = false;
    protected $fillable = ['address', 'paymeny_method'];

    public function oois(){
        return $this->hasMany(OOI::class);
    }

    public function updateTotalPrice()
    {
        $this->total_price = $this->orderitems->sum(function ($orderitem) {
            return $orderitem->total_price;
        });
        $this->save();
    }
}
