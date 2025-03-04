<?php

namespace Domain\Subscribers\Actions;

use Domain\Subscribers\Models\Subscriber;
use Domain\Subscribers\DTOs\CreateSubscriberData;

class CreateSubscriberAction
{
    public function __invoke(CreateSubscriberData $dto): Subscriber
    {
        $subscriber = Subscriber::create([
            'email' => $dto->email,
            'name' => $dto->name,
            'state' => $dto->state
        ]);

        if (!empty($dto->fields)) {
            $subscriber->fields()->sync(
                collect($dto->fields)->mapWithKeys(fn($field) => [$field['id'] => ['value' => $field['value']]])
            );
        }

        return $subscriber->fresh();
    }
}
