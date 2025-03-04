<?php

namespace App\Http\Requests\Fields;

use Domain\Fields\Enums\FieldTypesEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreFieldRequest extends FormRequest
{
    public function rules()
    {
        return [
            'title' => [
                'required',
                'string',
                'max:255',
            ],
            'type' => [
                'required',
                Rule::enum(FieldTypesEnum::class),
            ],
        ];
    }
}
