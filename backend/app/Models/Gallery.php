<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Gallery extends Model{
    protected $table = "gallery";
    public $timestamps = false;
    protected $fillable = ['product_id','path'];

    public function product(){
        return $this->belongsTo(Product::class);
    }
}