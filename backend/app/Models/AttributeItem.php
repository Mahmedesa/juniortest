<?php 

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class AttributeItem extends Model{
    protected $table = "attributeitem";
    public $timestamps = false;
    protected $fillable = ['id','value','display_value'];

    public function pais() {
        return $this->hasMany(PAI::class, 'attributeitem_id');
    }
    public function oiais(){
        return $this->hasMany(OIAI::class);
    }
}

