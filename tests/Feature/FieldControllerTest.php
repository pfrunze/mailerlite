<?php

namespace Tests\Feature;

use Domain\Fields\Models\Field;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class FieldControllerTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    public function setUp(): void
    {
        parent::setUp();
    }

    public function test_it_can_list_all_fields()
    {
        Field::factory()->count(3)->create();

        $response = $this->getJson('/api/fields');

        $response->assertStatus(200)
            ->assertJsonStructure([
            '*' => ['id', 'title', 'type', 'created_at', 'updated_at'],
            ])
            ->assertJsonCount(3);
    }

    public function test_it_can_store_a_new_field()
    {
        $data = [
            'title' => $this->faker->unique()->word,
            'type' => 'string',
        ];

        $response = $this->postJson('/api/fields', $data);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'title', 'type', 'created_at', 'updated_at'])
            ->assertJsonFragment(['title' => $data['title'], 'type' => $data['type']]);

        $this->assertDatabaseHas('fields', [
            'title' => $data['title'],
            'type' => $data['type'],
        ]);
    }

    public function test_it_fails_to_store_a_field_with_invalid_data()
    {
        $data = [
            'title' => '',
            'type' => 'string',
        ];

        $response = $this->postJson('/api/fields', $data);

        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors'])
            ->assertJsonValidationErrors(['title']);
    }

    public function test_it_can_show_a_specific_field()
    {
        $field = Field::factory()->create(['type' => 'string']);

        $response = $this->getJson("/api/fields/{$field->id}");

        $response->assertStatus(200)
            ->assertJsonStructure(['id', 'title', 'type', 'created_at', 'updated_at'])
            ->assertJsonFragment(['id' => $field->id, 'title' => $field->title, 'type' => $field->type]);
    }

    public function test_it_can_delete_a_field()
    {
        $field = Field::factory()->create(['type' => 'string']);

        $response = $this->deleteJson("/api/fields/{$field->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('fields', ['id' => $field->id]);
    }

    public function test_it_fails_to_delete_a_nonexistent_field()
    {
        $response = $this->deleteJson('/api/fields/999');

        $response->assertStatus(404);
    }
}