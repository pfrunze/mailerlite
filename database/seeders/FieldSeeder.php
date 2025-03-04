<?php

namespace Database\Seeders;

use Domain\Fields\Models\Field;
use Illuminate\Database\Seeder;

class FieldSeeder extends Seeder
{
    public function run()
    {
        $fields = [
            ['title' => 'Zip', 'type' => 'string'],
            ['title' => 'State', 'type' => 'string'],
            ['title' => 'Phone', 'type' => 'string'],
            ['title' => 'Last name', 'type' => 'string'],
            ['title' => 'Country', 'type' => 'string'],
            ['title' => 'Company', 'type' => 'string'],
            ['title' => 'City', 'type' => 'string'],
            ['title' => 'Date', 'type' => 'date'],
            ['title' => 'Boolean field', 'type' => 'boolean'],
            ['title' => 'Age', 'type' => 'number'],
        ];

        foreach ($fields as $field) {
            Field::create($field);
        }
    }
}