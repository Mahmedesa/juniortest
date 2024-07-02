<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model{
    protected $table = "product";
    public $timestamps = false;
    protected $fillable = ['idname','name','inStock','image','category_id','description','price','currency_label','currency_symbol','brand'];

    public function category(){
        return $this->belongsTo(Category::class);
    }
    public function productattributes(){
        return $this->hasMany(PA::class);
    }
    public function galleries(){
        return $this->hasMany(Gallery::class);
    }
    public function orderitems(){
        return $this->hasMany(OrderItem::class);
    }

}
