<?php

namespace Database\Factories;

use Domain\Fields\Enums\FieldTypesEnum;
use Domain\Fields\Models\Field;
use Domain\Subscribers\Enums\SubscriberStatesEnum;
use Domain\Subscribers\Models\Subscriber;
use Illuminate\Database\Eloquent\Factories\Factory;

class SubscriberFactory extends Factory
{
    protected $model = Subscriber::class;

    public function definition()
    {
        return [
            'email' => $this->faker->unique()->safeEmail,
            'name' => $this->faker->name,
            'state' => $this->faker->randomElement(array_column(SubscriberStatesEnum::cases(), 'value')),
        ];
    }

    public function configure()
    {
        return $this->afterCreating(function (Subscriber $subscriber) {
            $fields = Field::inRandomOrder()->limit(rand(1, 3))->get();
            foreach ($fields as $field) {
                $value = $this->generateFieldValue($field->type);
                $subscriber->fields()->attach($field->id, ['value' => $value]);
            }
        });
    }

    private function generateFieldValue($type)
    {
        return match ($type) {
            FieldTypesEnum::NUMBER->value => $this->faker->numberBetween(1, 100),
            FieldTypesEnum::DATE->value => $this->faker->date(),
            FieldTypesEnum::BOOLEAN->value => $this->faker->boolean(),
            FieldTypesEnum::STRING->value => $this->faker->word,
            default => $this->faker->word,
        };
    }
}