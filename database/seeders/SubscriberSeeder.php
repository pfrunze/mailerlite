<?php

namespace Database\Seeders;

use Domain\Fields\Models\Field;
use Domain\Subscribers\Models\Subscriber;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Date;

class SubscriberSeeder extends Seeder
{
    public function run()
    {
        Subscriber::factory(10)->create();

        $subscriber = Subscriber::create([
            'email' => 'pavelfrunze1@gmail.com',
            'name' => 'Pavel Frunze',
            'state' => 'active',
            'created_at' => Date::now()->addSeconds(1),
        ]);

        $fields = [
            ['title' => 'Last name', 'value' => 'Frunze'],
            ['title' => 'Phone', 'value' => '123-456-7890'],
            ['title' => 'Zip', 'value' => '4834'],
            ['title' => 'State', 'value' => 'Criuleni'],
            ['title' => 'Country', 'value' => 'Moldova'],
            ['title' => 'Company', 'value' => 'MailerLite'],
            ['title' => 'City', 'value' => 'Pascani'],
            ['title' => 'Date', 'value' => Date::now()],
        ];

        foreach ($fields as $fieldData) {
            $field = Field::where('title', $fieldData['title'])->first();
            if ($field) {
                $subscriber->fields()->attach($field->id, ['value' => $fieldData['value']]);
            }
        }
    }
}