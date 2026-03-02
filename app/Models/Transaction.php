<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array
     */
    protected $fillable = [
        'account_id',
        'category_id',
        'description',
        'amount',
        'type',
        'date',
        'cancelled_at',
        'parent_transaction_id',
    ];

    /**
     * Os atributos que devem ser convertidos (cast).
     *
     * @var array
     */
    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
        'cancelled_at' => 'datetime',
    ];

    /**
     * Obtém a conta associada à transação.
     */
    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    /**
     * Obtém a categoria associada à transação.
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }
}
