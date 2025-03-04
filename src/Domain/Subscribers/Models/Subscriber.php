<?php

namespace Domain\Subscribers\Models;

use Database\Factories\SubscriberFactory;
use Domain\Fields\Models\Field;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscriber extends Model
{
    use HasFactory;

    protected $fillable = ['email', 'name', 'state'];
    
    protected $casts = [
        'state' => 'string'
    ];

    protected static function newFactory(): SubscriberFactory
    {
        return new SubscriberFactory();
    }

    public function fields()
    {
        return $this->belongsToMany(Field::class)
            ->withPivot('value')
            ->withTimestamps();
    }
}
