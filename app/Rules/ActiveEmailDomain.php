<?php

namespace App\Rules;

use App\Services\DomainChecker;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Cache;

class ActiveEmailDomain implements ValidationRule
{
    protected $checker;

    public function __construct(DomainChecker $checker)
    {
        $this->checker = $checker;
    }

    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        try {
            if (!$value || !filter_var($value, FILTER_VALIDATE_EMAIL)) {
                $fail('The :attribute must be a valid email address.');
            }

            $domain = substr(strrchr($value, "@"), 1);

            if (!$domain) {
                $fail('The :attribute must contain a valid domain.');
            }

            $cacheKey = "domain_check_{$domain}";
            $cacheTTL = 43200;

            if ($domain) {
                $checker = $this->checker;
                $isActive = Cache::remember($cacheKey, $cacheTTL, function () use ($domain, $checker) {
                    return $checker->check($domain);
                });
            }

            if (!$isActive) {
                $fail('The domain of :attribute is not active or does not exist.');
            }

        } catch (\Exception $e) {
            $fail('An error occurred while validating the :attribute domain.');
        }
    }
}
