<?php

namespace App\Http\Requests\Subscribers;

use App\Rules\ActiveEmailDomain;
use Domain\Fields\Enums\FieldTypesEnum;
use Domain\Fields\Models\Field;
use Domain\Subscribers\Enums\SubscriberStatesEnum;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreSubscriberRequest extends FormRequest
{
    public function rules()
    {
        return [
            'email' => [
                'required',
                'email',
                'unique:subscribers,email',
                app(ActiveEmailDomain::class),
            ],
            'name' => [
                'required',
                'string',
                'max:255',
            ],
            'state' => [
                'required',
                Rule::enum(SubscriberStatesEnum::class),
            ],
            'fields' => [
                'sometimes',
                'array',
            ],
            'fields.*.id' => [
                'exists:fields,id',
            ],
            'fields.*.value' => [
                function ($attribute, $value, $fail) {
                    $index = explode('.', $attribute)[1];
                    $fieldId = $this->input("fields.{$index}.id");

                    if (!$fieldId) {
                        return;
                    }

                    $field = Field::find($fieldId);

                    if (!$field) {
                        return;
                    }
                    
                    switch ($field->type) {
                        case FieldTypesEnum::STRING->value:
                            if (!is_string($value)) {
                                $fail("The {$attribute} must be a string.");
                            }
                            break;
                        case FieldTypesEnum::NUMBER->value:
                            if (!is_numeric($value)) {
                                $fail("The {$attribute} must be a number.");
                            }
                            break;
                        case FieldTypesEnum::DATE->value:
                            if (!strtotime($value)) {
                                $fail("The {$attribute} must be a valid date.");
                            }
                            break;
                        case FieldTypesEnum::BOOLEAN->value:
                            if (!in_array($value, [true, false, 0, 1, '0', '1'], true)) {
                                $fail("The {$attribute} must be a boolean (true, false, 0, or 1).");
                            }
                            break;
                        default:
                            $fail("The {$attribute} has an invalid type.");
                    }
                }
            ],
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'The email field is required.',
            'email.email' => 'The email must be a valid email address.',
            'email.unique' => 'This email is already registered.',
            'name.required' => 'The name field is required.',
            'name.string' => 'The name must be a string.',
            'name.max' => 'The name may not be greater than 255 characters.',
            'state.required' => 'The state field is required.',
            'state.enum' => 'The state must be one of: active, unsubscribed, junk, bounced, unconfirmed.',
            'fields.array' => 'The fields must be an array.',
            'fields.*.id.exists' => 'The selected field ID is invalid.',
        ];
    }
}
