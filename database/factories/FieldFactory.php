<?php

namespace Database\Factories;

use Domain\Fields\Enums\FieldTypesEnum;
use Domain\Fields\Models\Field;
use Illuminate\Database\Eloquent\Factories\Factory;

class FieldFactory extends Factory
{
    protected $model = Field::class;

    public function definition()
    {
        return [
            'title' => $this->faker->unique()->word,
            'type' => $this->faker->randomElement(array_column(FieldTypesEnum::cases(), 'value')),
        ];
    }
}