<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asset extends Model
{
    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'type',
        'estimated_value',
        'currency_id',
    ];

    /**
     * Obtém o utilizador proprietário do ativo.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtém a moeda do valor estimado do ativo.
     */
    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }
}
