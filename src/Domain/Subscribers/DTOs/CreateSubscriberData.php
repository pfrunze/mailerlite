<?php

namespace Domain\Subscribers\DTOs;

use Spatie\LaravelData\Data;

class CreateSubscriberData extends Data
{
    public function __construct(
        public string $email,
        public string $name,
        public string $state,
        public ?array $fields = []
    ) {
    }
}
