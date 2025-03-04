<?php

namespace Domain\Fields\Actions;

use Domain\Fields\DTOs\CreateFieldData;
use Domain\Fields\Models\Field;

class CreateFieldAction
{
    public function __invoke(CreateFieldData $dto): Field
    {
        return Field::create([
            'title' => $dto->title,
            'type' => $dto->type,
        ]);
    }
}
