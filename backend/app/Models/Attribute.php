<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attribute extends Model{
    protected $table = "attribute";
    public $timestamps = false;
    protected $fillable = ['id','id_name','name','type'];

    public function pais(){
        return $this->hasMany(PAI::class);
    }

    public function productattributes(){
        return $this->hasMany(PA::class);
    }

}