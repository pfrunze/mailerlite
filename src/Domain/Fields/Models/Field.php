<?php

namespace Domain\Fields\Models;

use Database\Factories\FieldFactory;
use Illuminate\Database\Eloquent\Model;
use Domain\Subscribers\Models\Subscriber;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Field extends Model
{
    use HasFactory;

    protected $guarded = [];

    protected static function newFactory(): FieldFactory
    {
        return new FieldFactory();
    }

    public function subscribers()
    {
        return $this->belongsToMany(Subscriber::class)
            ->withPivot('value')
            ->withTimestamps();
    }
}
