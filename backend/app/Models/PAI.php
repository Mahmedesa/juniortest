<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PAI extends Model{
    protected $table = "p_ai";
    public $timestamps = false;
    protected $fillable = ['id','attributeitem_id','attribute_id'];

    public function attributeitem(){
        return $this->belongsTo(AttributeItem::class);
    }
    public function attribute(){
        return $this->belongsTo(Attribute::class);
    }
    
}