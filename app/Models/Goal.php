<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    /**
     * Os atributos que podem ser atribuídos em massa.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'target_amount',
        'current_amount',
        'due_date',
    ];

    /**
     * Obtém o utilizador proprietário da meta.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
