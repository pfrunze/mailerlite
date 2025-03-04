<?php

namespace Domain\Fields\DTOs;

use Spatie\LaravelData\Data;

class CreateFieldData extends Data
{
    public function __construct(
        public string $title,
        public string $type
    ) {
    }
}
