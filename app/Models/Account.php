<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Account extends Model
{
    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'currency_id',
        'name',
        'type',
        'balance',
    ];

    /**
     * Obtém a moeda da conta.
     */
    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    /**
     * Obtém o utilizador proprietário da conta.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Obtém as transações desta conta.
     */
    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }
}
