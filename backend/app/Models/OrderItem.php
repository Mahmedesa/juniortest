<?php 

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class OrderItem extends Model{
    protected $table = "orderitem";
    public $timestamps = false;
    protected $fillable = ['product_id','quantity'];

    public function oiais(){
        return $this->hasMany(OIAI::class);
    }
    public function product(){
        return $this->belongsTo(Product::class);
    }
    public function oois(){
        return $this->hasMany(OOI::class);
    }
    public function getTotalPriceAttribute(){
        return $this->quantity * $this->product->price;
    }
}    
