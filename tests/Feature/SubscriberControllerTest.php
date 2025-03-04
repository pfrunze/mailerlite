<?php

namespace Tests\Feature;

use App\Services\DomainChecker;
use Domain\Fields\Models\Field;
use Domain\Subscribers\Models\Subscriber;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Cache;
use Mockery;
use Tests\TestCase;

class SubscriberControllerTest extends TestCase
{
    use RefreshDatabase;

    public function setUp(): void
    {
        parent::setUp();
        Cache::flush();
    }

    public function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_it_can_store_a_new_subscriber()
    {
        $domainCheckerMock = Mockery::mock(DomainChecker::class);
        $domainCheckerMock->shouldReceive('check')->once()->andReturn(true);
        $this->app->instance(DomainChecker::class, $domainCheckerMock);

        $field = Field::factory()->create(['type' => 'string']);
        $data = [
            'email' => fake()->unique()->safeEmail,
            'name' => fake()->name,
            'state' => 'active',
            'fields' => [
                ['id' => $field->id, 'value' => fake()->word],
            ],
        ];

        $response = $this->postJson('/api/subscribers', $data);

        $response->assertStatus(201)
            ->assertJsonStructure(['id', 'email', 'name', 'state', 'fields'])
            ->assertJsonFragment(['email' => $data['email']]);

        $this->assertDatabaseHas('subscribers', [
            'email' => $data['email'],
            'name' => $data['name'],
            'state' => 'active',
        ]);

        $this->assertDatabaseHas('field_subscriber', [
            'subscriber_id' => Subscriber::where('email', $data['email'])->first()->id,
            'field_id' => $field->id,
            'value' => $data['fields'][0]['value'],
        ]);
    }

    public function test_it_fails_to_store_a_subscriber_with_invalid_data()
    {
        Mockery::mock('alias:checkdnsrr')->shouldReceive('checkdnsrr')->andReturn(false);

        $field = Field::factory()->create(['type' => 'string']);
        $data = [
            'email' => 'invalid-email',
            'name' => '',
            'state' => 'invalid-state',
            'fields' => [
                ['id' => $field->id, 'value' => 'Test Value'],
            ],
        ];

        $response = $this->postJson('/api/subscribers', $data);

        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors'])
            ->assertJsonValidationErrors(['email', 'name', 'state']);
    }

    public function test_it_can_delete_a_subscriber()
    {
        $subscriber = Subscriber::factory()->create();

        $response = $this->deleteJson("/api/subscribers/{$subscriber->id}");

        $response->assertStatus(204);
        $this->assertDatabaseMissing('subscribers', ['id' => $subscriber->id]);
    }

    public function test_it_fails_to_delete_a_nonexistent_subscriber()
    {
        $response = $this->deleteJson('/api/subscribers/999');

        $response->assertStatus(404);
    }

    public function test_it_fails_to_store_a_subscriber_with_invalid_domain()
    {
        $domainCheckerMock = Mockery::mock(DomainChecker::class);
        $domainCheckerMock->shouldReceive('check')->once()->andReturn(false);
        $this->app->instance(DomainChecker::class, $domainCheckerMock);

        $data = [
            'email' => 'user@asgdvasgdasdg.sjdfgsdfusd',
            'name' => fake()->name,
            'state' => 'active',
            'fields' => [],
        ];

        $response = $this->postJson('/api/subscribers', $data);

        $response->assertStatus(422)
            ->assertJsonStructure(['message', 'errors'])
            ->assertJsonValidationErrors(['email'])
            ->assertJsonPath('errors.email', function ($errors) {
            $expectedMessages = [
                'The domain of email is not active or does not exist.',
            ];

            return count(array_intersect($errors, $expectedMessages)) === count($errors);
        });
    }
}