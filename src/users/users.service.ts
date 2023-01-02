import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
    constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

    create(email: string, password: string) {
        // afterInsert() 등과 같은 후크를 세팅할 수 있다.
        const user = this.repo.create({ email, password });
        
        return this.repo.save(user);
    }

    async findOne(id: number) {
        const user = await this.repo.findOneBy({ id });

        if (!user) {
            throw new NotFoundException('user not found');
        }

        return user;
    }

    find(email: string) {
        return this.repo.find({ where: { email } });
    }

    async update(id: number, attrs: Partial<User>) {
        const user = await this.findOne(id);
        return this.repo.save({ ...user, ...attrs});
    }

    async remove(id: number) {
        const user = await this.findOne(id);
        return this.repo.remove(user);
    }
}
